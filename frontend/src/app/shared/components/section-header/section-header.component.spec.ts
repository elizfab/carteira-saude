import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  let fixture: ComponentFixture<SectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SectionHeaderComponent] }).compileComponents();
    fixture = TestBed.createComponent(SectionHeaderComponent);
  });

  it('mostra o título e o ícone', () => {
    fixture.componentRef.setInput('icone', 'heart');
    fixture.componentRef.setInput('titulo', 'Condições e Diagnósticos');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Condições e Diagnósticos');
    expect(fixture.nativeElement.querySelector('.section-icon')).toBeTruthy();
  });

  it('mostra o subtítulo só quando informado', () => {
    fixture.componentRef.setInput('icone', 'heart');
    fixture.componentRef.setInput('titulo', 'T');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.hint')).toBeFalsy();

    fixture.componentRef.setInput('subtitulo', 'Um hint qualquer');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.hint')?.textContent).toContain('Um hint qualquer');
  });
});
