import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-form-alert',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './form-alert.component.html',
  styleUrl: './form-alert.component.scss',
})
export class FormAlertComponent {
  @Input() control!: AbstractControl | null;
  @Input() messages: { [key: string]: string } = {};
  @Input() showIfFormErrorKey: string | null = null;
  @Input() parentForm: any;

  get errorKeys(): string[] {
    return this.control?.errors ? Object.keys(this.control.errors) : [];
  }

  get customFormError(): string | null {
    if (
      this.showIfFormErrorKey &&
      this.parentForm?.getError(this.showIfFormErrorKey)
    ) {
      return this.messages[this.showIfFormErrorKey] || 'Form error';
    }
    return null;
  }

  shouldShow(): boolean {
    const controlTouched = this.control?.touched && this.control?.errors;
    const formError =
      this.showIfFormErrorKey &&
      this.parentForm?.getError(this.showIfFormErrorKey) &&
      this.control?.touched; // Only show mismatch if rePassword touched

    return !!(controlTouched || formError);
  }
}
