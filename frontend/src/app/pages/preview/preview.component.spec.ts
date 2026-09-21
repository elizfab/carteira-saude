import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio, criarVacinaVazia } from '../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../core/state/perfil';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
  let fixture: ComponentFixture<PreviewComponent>;
  let component: PreviewComponent;
  let router: Router;

  const perfil = { ...criarPerfilVazio('p1', 'Ana'), vacinas: [{ ...criarVacinaVazia('v1'), nome: 'BCG' }] };

  const configurar = async (queryParamMap: Record<string, string>) => {
    await TestBed.configureTestingModule({
      imports: [PreviewComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfil },
            { selector: selectTodosPerfis, value: [perfil] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap(queryParamMap)) },
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  };

  it('mostra o nome do perfil ativo e a contagem de páginas na barra superior', async () => {
    await configurar({});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ana');
    expect(fixture.nativeElement.textContent).toContain(`${component.paginas().length} página(s) A4`);
  });

  it('renderiza a página de dados pessoais com o nome do perfil', () => {
    return configurar({}).then(() => {
      fixture.detectChanges();
      const primeiraPagina = fixture.nativeElement.querySelector('.print-page');
      expect(primeiraPagina.textContent).toContain('Dados Pessoais');
      expect(primeiraPagina.textContent).toContain('Ana');
    });
  });

  it('renderiza a linha da vacina cadastrada numa página de tabela', async () => {
    await configurar({});
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('BCG');
  });

  it('dispara window.print automaticamente quando auto=print está na URL', async () => {
    jest.useFakeTimers();
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => undefined);
    await configurar({ auto: 'print' });
    fixture.detectChanges();

    jest.advanceTimersByTime(80);
    expect(printSpy).toHaveBeenCalled();

    printSpy.mockRestore();
    jest.useRealTimers();
  });

  it('não imprime automaticamente sem o parâmetro auto=print', async () => {
    jest.useFakeTimers();
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => undefined);
    await configurar({});
    fixture.detectChanges();

    jest.advanceTimersByTime(200);
    expect(printSpy).not.toHaveBeenCalled();

    printSpy.mockRestore();
    jest.useRealTimers();
  });

  it('voltar navega para /carteira/dados', async () => {
    await configurar({});
    fixture.detectChanges();
    component.voltar();
    expect(router.navigate).toHaveBeenCalledWith(['/carteira', 'dados']);
  });

  it('REGRESSÃO: abrir a pré-visualização e imprimir não altera os dados do perfil ativo', async () => {
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => undefined);
    await configurar({});
    fixture.detectChanges();

    const antes = JSON.stringify(component.perfil());
    component.imprimir();
    const depois = JSON.stringify(component.perfil());

    expect(depois).toBe(antes);
    printSpy.mockRestore();
  });
});
