import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { mascararTelefone } from '../utils/mask.util';

@Directive({
  selector: 'input[appMascaraTelefone]',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneMaskDirective), multi: true },
  ],
  host: {
    '(input)': 'aoDigitar($event)',
    '(blur)': 'aoTocarFn()',
  },
})
export class PhoneMaskDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private aoAlterar: (valor: string) => void = () => {};
  aoTocarFn: () => void = () => {};

  aoDigitar(event: Event): void {
    const valorBruto = (event.target as HTMLInputElement).value;
    const mascarado = mascararTelefone(valorBruto);
    this.elementRef.nativeElement.value = mascarado;
    this.aoAlterar(mascarado);
  }

  writeValue(valor: string): void {
    this.elementRef.nativeElement.value = valor ? mascararTelefone(valor) : '';
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.aoAlterar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.aoTocarFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }
}
