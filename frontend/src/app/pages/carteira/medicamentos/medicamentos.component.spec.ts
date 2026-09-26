import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { MedicamentosComponent } from './medicamentos.component';

describe('MedicamentosComponent', () => {
  let fixture: ComponentFixture<MedicamentosComponent>;
  let component: MedicamentosComponent;
  let facade: PerfilFacadeService;

  const linha = { id: 'm1', nome: 'Losartana', dosagem: '50mg', inicio: '', termino: 'Em uso', medico: '', obs: '' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), medicamentos: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentosComponent],
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

    fixture = TestBed.createComponent(MedicamentosComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete os medicamentos do perfil ativo, preservando "Em uso" em término', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria um medicamento vazio com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('medicamentos', {
      id: 'novo-id',
      nome: '',
      dosagem: '',
      inicio: '',
      termino: '',
      medico: '',
      obs: '',
    });
  });

  it('remover e alterar delegam ao facade', () => {
    const removerSpy = jest.spyOn(facade, 'removerLinha');
    const alterarSpy = jest.spyOn(facade, 'atualizarLinha');

    component.remover(0);
    component.alterar({ indice: 0, patch: { termino: '2026-01-01' } });

    expect(removerSpy).toHaveBeenCalledWith('medicamentos', 0);
    expect(alterarSpy).toHaveBeenCalledWith('medicamentos', 0, { termino: '2026-01-01' });
  });
});
