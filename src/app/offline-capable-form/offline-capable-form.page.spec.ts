import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineCapableFormPage } from './offline-capable-form.page';

describe('OfflineCapableFormPage', () => {
  let component: OfflineCapableFormPage;
  let fixture: ComponentFixture<OfflineCapableFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineCapableFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
