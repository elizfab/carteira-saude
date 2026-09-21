import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { ExamesComponent } from './exames.component';

describe('ExamesComponent', () => {
  let fixture: ComponentFixture<ExamesComponent>;
  let component: ExamesComponent;
  let facade: PerfilFacadeService;

  const linha = { id: 'e1', data: '2026-01-01', tipo: 'Hemograma', resultado: '', medico: '', proximo: '' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), exames: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamesComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfil },
            { selector: selectTodosPerfis, value: [perfil] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: IdService, useValue: { gerar: () => 'novo-id' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamesComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete os exames do perfil ativo', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria um exame vazio com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('exames', {
      id: 'novo-id',
      data: '',
      tipo: '',
      resultado: '',
      medico: '',
      proximo: '',
    });
  });

  it('remover e alterar delegam ao facade', () => {
    const removerSpy = jest.spyOn(facade, 'removerLinha');
    const alterarSpy = jest.spyOn(facade, 'atualizarLinha');

    component.remover(0);
    component.alterar({ indice: 0, patch: { resultado: 'Normal' } });

    expect(removerSpy).toHaveBeenCalledWith('exames', 0);
    expect(alterarSpy).toHaveBeenCalledWith('exames', 0, { resultado: 'Normal' });
  });
});
