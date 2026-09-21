import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ITENS_NAVEGACAO } from '../../../models';
import { AppSidenavComponent } from './app-sidenav.component';

describe('AppSidenavComponent', () => {
  let fixture: ComponentFixture<AppSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSidenavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSidenavComponent);
    fixture.detectChanges();
  });

  it('renderiza um item de menu para cada seção da carteira', () => {
    const itens = fixture.nativeElement.querySelectorAll('li[nz-menu-item]');
    expect(itens.length).toBe(ITENS_NAVEGACAO.length);
  });

  it('mostra o rótulo de cada seção', () => {
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Dados pessoais');
    expect(texto).toContain('Vacinação');
    expect(texto).toContain('Opções de impressão');
  });
});
