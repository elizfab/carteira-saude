import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { ControleComponent } from './controle.component';

describe('ControleComponent', () => {
  let fixture: ComponentFixture<ControleComponent>;
  let component: ControleComponent;
  let facade: PerfilFacadeService;

  const linha = { id: 'm1', data: '2026-01-01', peso: '70', pressao: '120/80', glicemia: '', obs: '' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), controle: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleComponent],
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

    fixture = TestBed.createComponent(ControleComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete as medições do perfil ativo, sem exigir formato numérico', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria uma medição vazia com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('controle', {
      id: 'novo-id',
      data: '',
      peso: '',
      pressao: '',
      glicemia: '',
      obs: '',
    });
  });

  it('remover e alterar delegam ao facade', () => {
    const removerSpy = jest.spyOn(facade, 'removerLinha');
    const alterarSpy = jest.spyOn(facade, 'atualizarLinha');

    component.remover(0);
    component.alterar({ indice: 0, patch: { peso: '71' } });

    expect(removerSpy).toHaveBeenCalledWith('controle', 0);
    expect(alterarSpy).toHaveBeenCalledWith('controle', 0, { peso: '71' });
  });
});
