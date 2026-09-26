import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { CondicoesComponent } from './condicoes.component';

describe('CondicoesComponent', () => {
  let fixture: ComponentFixture<CondicoesComponent>;
  let component: CondicoesComponent;
  let facade: PerfilFacadeService;

  const linha = { id: 'c1', condicao: 'Asma', descoberta: '2020-01-01', acomp: 'Dra. Bia', obs: '' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), condicoes: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondicoesComponent],
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

    fixture = TestBed.createComponent(CondicoesComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete as condições do perfil ativo', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria uma condição vazia com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('condicoes', {
      id: 'novo-id',
      condicao: '',
      descoberta: '',
      acomp: '',
      obs: '',
    });
  });

  it('remover delega o índice ao facade', () => {
    const spy = jest.spyOn(facade, 'removerLinha');
    component.remover(2);
    expect(spy).toHaveBeenCalledWith('condicoes', 2);
  });

  it('alterar delega índice e patch ao facade', () => {
    const spy = jest.spyOn(facade, 'atualizarLinha');
    component.alterar({ indice: 0, patch: { condicao: 'Bronquite' } });
    expect(spy).toHaveBeenCalledWith('condicoes', 0, { condicao: 'Bronquite' });
  });
});
