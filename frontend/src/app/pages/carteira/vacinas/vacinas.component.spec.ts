import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { VacinasComponent } from './vacinas.component';

describe('VacinasComponent', () => {
  let fixture: ComponentFixture<VacinasComponent>;
  let component: VacinasComponent;
  let facade: PerfilFacadeService;

  const linha = { id: 'v1', nome: 'BCG', dose: '1ª', data: '', lote: '', local: '', reforco: '', obs: '' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), vacinas: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinasComponent],
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

    fixture = TestBed.createComponent(VacinasComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete as vacinas do perfil ativo', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria uma vacina vazia com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('vacinas', {
      id: 'novo-id',
      nome: '',
      dose: '',
      data: '',
      lote: '',
      local: '',
      reforco: '',
      obs: '',
    });
  });

  it('remover e alterar delegam ao facade', () => {
    const removerSpy = jest.spyOn(facade, 'removerLinha');
    const alterarSpy = jest.spyOn(facade, 'atualizarLinha');

    component.remover(0);
    component.alterar({ indice: 0, patch: { dose: '2ª' } });

    expect(removerSpy).toHaveBeenCalledWith('vacinas', 0);
    expect(alterarSpy).toHaveBeenCalledWith('vacinas', 0, { dose: '2ª' });
  });
});
