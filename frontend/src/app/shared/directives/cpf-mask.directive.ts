import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { mascararCpf } from '../utils/mask.util';

@Directive({
  selector: 'input[appMascaraCpf]',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CpfMaskDirective), multi: true },
  ],
  host: {
    '(input)': 'aoDigitar($event)',
    '(blur)': 'aoTocarFn()',
  },
})
export class CpfMaskDirective implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);
  private aoAlterar: (valor: string) => void = () => {};
  aoTocarFn: () => void = () => {};

  aoDigitar(event: Event): void {
    const valorBruto = (event.target as HTMLInputElement).value;
    const mascarado = mascararCpf(valorBruto);
    this.elementRef.nativeElement.value = mascarado;
    this.aoAlterar(mascarado);
  }

  writeValue(valor: string): void {
    this.elementRef.nativeElement.value = valor ? mascararCpf(valor) : '';
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
