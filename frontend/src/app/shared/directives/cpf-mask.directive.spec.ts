import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CpfMaskDirective } from './cpf-mask.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CpfMaskDirective],
  template: `<input [formControl]="controle" appMascaraCpf />`,
})
class HostComponent {
  controle = new FormControl('', { nonNullable: true });
}

describe('CpfMaskDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('mascara o valor digitado e atualiza o FormControl', () => {
    input.value = '12345678901';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('123.456.789-01');
    expect(host.controle.value).toBe('123.456.789-01');
  });

  it('escreve o valor mascarado no input quando o FormControl é definido programaticamente', () => {
    host.controle.setValue('98765432100');
    fixture.detectChanges();

    expect(input.value).toBe('987.654.321-00');
  });

  it('mostra vazio quando o FormControl é limpo', () => {
    host.controle.setValue('12345678901');
    fixture.detectChanges();
    host.controle.setValue('');
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('desabilita o input quando o FormControl é desabilitado', () => {
    host.controle.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
});
