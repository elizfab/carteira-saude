import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { ConsultasComponent } from './consultas.component';

describe('ConsultasComponent', () => {
  let fixture: ComponentFixture<ConsultasComponent>;
  let component: ConsultasComponent;
  let facade: PerfilFacadeService;

  const linha = {
    id: 'c1',
    data: '2026-01-01',
    especialidade: 'Pediatria',
    medico: '',
    diagnostico: '',
    recomendacoes: '',
    retorno: '',
  };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), consultas: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasComponent],
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

    fixture = TestBed.createComponent(ConsultasComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete as consultas do perfil ativo', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria uma consulta vazia com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('consultas', {
      id: 'novo-id',
      data: '',
      especialidade: '',
      medico: '',
      diagnostico: '',
      recomendacoes: '',
      retorno: '',
    });
  });

  it('remover e alterar delegam ao facade', () => {
    const removerSpy = jest.spyOn(facade, 'removerLinha');
    const alterarSpy = jest.spyOn(facade, 'atualizarLinha');

    component.remover(0);
    component.alterar({ indice: 0, patch: { diagnostico: 'Otite' } });

    expect(removerSpy).toHaveBeenCalledWith('consultas', 0);
    expect(alterarSpy).toHaveBeenCalledWith('consultas', 0, { diagnostico: 'Otite' });
  });
});
