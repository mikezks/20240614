import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightFilter } from '../../logic-flight';


@Component({
  selector: 'app-flight-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-filter.component.html'
})
export class FlightFilterComponent {
  private cdRef = inject(ChangeDetectorRef);

  filter = input.required<FlightFilter>();
  filterChange = output<FlightFilter>();

  protected inputFilterForm = inject(FormBuilder).nonNullable.group({
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    urgent: [false],
  });

  protected selectedFilterControl = new FormControl(this.inputFilterForm.getRawValue(), {
    nonNullable: true,
  });

  constructor() {
    effect(() => {
      this.inputFilterForm.setValue(this.filter());
      this.cdRef.markForCheck();
    });
  }

  protected triggerSearch(): void {
    this.filterChange.emit(this.inputFilterForm.getRawValue());
  }
}
