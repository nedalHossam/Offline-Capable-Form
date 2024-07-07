import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfflineSyncService } from '../services/offline-sync.service';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-offline-capable-form',
  templateUrl: './offline-capable-form.page.html',
  styleUrls: ['./offline-capable-form.page.scss'],
})
export class OfflineCapableFormPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  form: FormGroup;
  imagePreview: any;
  audioBlob: Blob | undefined;
  audioUrl: any;
  mediaRecorder: MediaRecorder | undefined;
  audioChunks: any[] = [];
  isRecording: boolean = false; // Track recording state
  audio: HTMLAudioElement | undefined;
  isPlaying: boolean = false; // Track playback state

  constructor(
    private fb: FormBuilder,
    private offlineSyncService: OfflineSyncService,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      textInput: ['', [Validators.required, Validators.maxLength(200)]],
      imageInput: [null, Validators.required],
      voiceInput: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.checkNetworkStatus();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.form.patchValue({ imageInput: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  startRecording() {
    console.log('Start recording initiated.');
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true; // Set recording state to true
        console.log('MediaRecorder started:', this.mediaRecorder);

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          console.log('Data available:', event.data);
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          console.log('Recording stopped.');
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioChunks = [];
          console.log('Audio Blob:', this.audioBlob);
          this.form.patchValue({ voiceInput: this.audioBlob });
          console.log('Form updated with audio blob:', this.form.value);
          this.isRecording = false; // Set recording state to false
        });

        console.log('Recording setup complete.');
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
      });
  }

  stopRecording() {
    console.log('Stop recording initiated.');
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      console.log('MediaRecorder stopped.');
    } else {
      console.warn('MediaRecorder is not initialized or not recording.');
    }
  }

  playRecording() {
    if (this.audioBlob) {
      this.audioUrl = URL.createObjectURL(this.audioBlob);
      this.audio = new Audio(this.audioUrl);
      this.audio.play();
      this.isPlaying = true;
      this.audio.onended = () => {
        this.isPlaying = false;
      };
      console.log('Playing recording.');
    } else {
      console.warn('No audio blob available to play.');
    }
  }

  pauseRecording() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      console.log('Paused recording.');
    }
  }
  deleteRecording() {
    if (this.audio) {
      this.audio.pause();
      this.audio = undefined;
    }
    this.audioBlob = undefined;
    this.audioUrl = null;
    this.isPlaying = false;
    this.form.patchValue({ voiceInput: null });
    console.log('Recording deleted.');
  }
  async checkNetworkStatus() {
    console.log('networkStatusChange.');
    const status = await Network.getStatus();
    console.log('networkStatusChange.', status);
    if (status.connected) {
      this.offlineSyncService.syncWithServer();
      console.log('status 1', status);
    }

    Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        this.offlineSyncService.syncWithServer();
        console.log('status 2', status);
      }
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        await this.offlineSyncService.saveFormData(this.form.value);
        const toast = await this.toastController.create({
          message: 'Form submitted successfully!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.form.reset();
        this.imagePreview = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.audioUrl = null;
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error submitting form. Please try again.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'Please fill out all required fields.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
