import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'kurai-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent {
  @Input() min?: Date;
  @Input() max?: Date;
  protected internalValue?: string;

  private get minValue(): Date {
    return this.min ?? new Date(0, 0, 0, 0, 0, 0, 0);
  }
  private get maxValue(): Date {
    return this.min ?? new Date(0, 0, 0, 23, 59, 59, 59);
  }
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  onSelectionChange(event: Event) {
    console.log('selectionChange', event);
  }

  onValueChange($event: Event) {
    console.log($event);
    const val = this.formatValue(this.internalValue ?? '');
    if (this.internalValue !== val) {
      this.internalValue = val;
      this.cdr.markForCheck();
    }
  }

  protected onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab': {
        const end = this.input?.nativeElement.selectionEnd ?? 0;
        if (!event.shiftKey && end < 3) {
          this.input?.nativeElement.setSelectionRange(3, 5);
          event.preventDefault();
        } else if (event.shiftKey && end > 3) {
          this.input?.nativeElement.setSelectionRange(0, 2);
          event.preventDefault();
        }
        break;
      }

      default:
        break;
    }
  }

  protected onInputFocused(): void {
    this.input?.nativeElement.setSelectionRange(0, 2);
  }

  private formatValue(value: string): string {
    const result = /([0-9]{0,2}):([0-9]{0,2})/g.exec(value);
    const hours = this.validateValue(
      result?.[1] ?? /[0-9]*/g.exec(value)?.[0] ?? '',
      this.minValue.getHours(),
      this.maxValue.getHours()
    );
    const minutes = this.validateValue(
      result?.[2] ?? '',
      this.minValue.getMinutes(),
      this.maxValue.getMinutes()
    );
    return `${hours}:${minutes}`;
  }

  private validateValue(value: string, min: number, max: number): string {
    const valueNumber = Number.parseInt(value);
    if (Number.isNaN(valueNumber) || valueNumber < min) {
      return this.padValue(min);
    }
    if (valueNumber > max) {
      return this.padValue(max);
    }
    return this.padValue(valueNumber);
  }

  private padValue(value: number): string {
    return `0${value}`.slice(-2);
  }
}
