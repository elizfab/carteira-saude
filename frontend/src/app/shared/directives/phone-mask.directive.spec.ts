import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PhoneMaskDirective } from './phone-mask.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, PhoneMaskDirective],
  template: `<input [formControl]="controle" appMascaraTelefone />`,
})
class HostComponent {
  controle = new FormControl('', { nonNullable: true });
}

describe('PhoneMaskDirective', () => {
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
    input.value = '11987654321';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(11) 98765-4321');
    expect(host.controle.value).toBe('(11) 98765-4321');
  });

  it('escreve o valor mascarado no input quando o FormControl é definido programaticamente', () => {
    host.controle.setValue('1123456789');
    fixture.detectChanges();

    expect(input.value).toBe('(11) 2345-6789');
  });

  it('desabilita o input quando o FormControl é desabilitado', () => {
    host.controle.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
});
