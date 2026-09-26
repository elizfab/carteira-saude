import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { CirurgiasComponent } from './cirurgias.component';

describe('CirurgiasComponent', () => {
  let fixture: ComponentFixture<CirurgiasComponent>;
  let component: CirurgiasComponent;
  let facade: PerfilFacadeService;

  const linha = { id: 'c1', data: '2020-01-01', procedimento: 'Apendicectomia', hospital: '', medico: '', obs: '' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), cirurgias: [linha] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirurgiasComponent],
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

    fixture = TestBed.createComponent(CirurgiasComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete as cirurgias do perfil ativo', () => {
    expect(component.linhas()).toEqual([linha]);
  });

  it('adicionar cria um registro vazio com um novo id', () => {
    const spy = jest.spyOn(facade, 'adicionarLinha');
    component.adicionar();
    expect(spy).toHaveBeenCalledWith('cirurgias', {
      id: 'novo-id',
      data: '',
      procedimento: '',
      hospital: '',
      medico: '',
      obs: '',
    });
  });

  it('remover e alterar delegam ao facade', () => {
    const removerSpy = jest.spyOn(facade, 'removerLinha');
    const alterarSpy = jest.spyOn(facade, 'atualizarLinha');

    component.remover(0);
    component.alterar({ indice: 0, patch: { hospital: 'Hospital Central' } });

    expect(removerSpy).toHaveBeenCalledWith('cirurgias', 0);
    expect(alterarSpy).toHaveBeenCalledWith('cirurgias', 0, { hospital: 'Hospital Central' });
  });
});
