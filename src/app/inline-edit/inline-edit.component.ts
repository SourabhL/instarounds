import { Component, Input, Optional, Host } from "@angular/core";
import { SatPopover } from "@ncstate/sat-popover";
import { filter } from "rxjs/operators";

@Component({
  selector: "inline-edit",
  styleUrls: ["inline-edit.component.scss"],
  template: `
    <form>
      <div class="mat-subheading-2">Update Pertinent Info</div>

      <mat-form-field>
        <input
          matInput
          maxLength="200"
          name="pertinentInfo"
          [(ngModel)]="pertinentInfo"
        />
      </mat-form-field>

      <div class="actions">
        <button mat-button type="button" color="primary" (click)="onCancel()">
          CANCEL
        </button>
        <button mat-button type="button" (click)="onSubmit()" color="primary">
          SAVE
        </button>
      </div>
    </form>
  `,
})
export class InlineEditComponent {
  /** Overrides the comment and provides a reset value when changes are cancelled. */
  @Input()
  get value(): string {
    return this._value;
  }
  set value(x: string) {
    this.pertinentInfo = this._value = x;
  }
  private _value = "";

  /** Form model for the input. */
  pertinentInfo = "";

  constructor(@Optional() @Host() public popover: SatPopover) {}

  ngOnInit() {
    // subscribe to cancellations and reset form value
    if (this.popover) {
      this.popover.closed
        .pipe(filter((val) => val == null))
        .subscribe(() => (this.pertinentInfo = this.value || ""));
    }
  }

  onSubmit() {
    console.log(this.pertinentInfo);
    if (this.popover) {
      console.log(this.pertinentInfo);
      this.popover.close(this.pertinentInfo);
    }
  }

  onCancel() {
    console.log(this.pertinentInfo);
    if (this.popover) {
      this.popover.close();
    }
  }
}
