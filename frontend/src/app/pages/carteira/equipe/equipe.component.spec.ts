import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NzModalService } from 'ng-zorro-antd/modal';
import { criarEquipeVazia, criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { IdService } from '../../../core/services/id.service';
import { EquipeComponent } from './equipe.component';

describe('EquipeComponent', () => {
  let fixture: ComponentFixture<EquipeComponent>;
  let component: EquipeComponent;
  let facade: PerfilFacadeService;
  let modal: { confirm: jest.Mock };

  const especialista = { ...criarEquipeVazia('e1', 'Pediatria'), profissional: 'Dra. Bia' };
  const perfil = { ...criarPerfilVazio('p1', 'Ana'), equipe: [especialista] };

  beforeEach(async () => {
    modal = { confirm: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [EquipeComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfil },
            { selector: selectTodosPerfis, value: [perfil] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: IdService, useValue: { gerar: () => 'novo-id' } },
        { provide: NzModalService, useValue: modal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipeComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('reflete a equipe do perfil ativo', () => {
    expect(component.equipe()).toEqual([especialista]);
  });

  it('rotulo usa "Sem especialidade" quando vazio', () => {
    expect(component.rotulo(especialista)).toBe('Pediatria');
    expect(component.rotulo(criarEquipeVazia('e2'))).toBe('Sem especialidade');
  });

  describe('adicionarEspecialista', () => {
    it('cria o especialista via facade e abre o painel dele', () => {
      const spy = jest.spyOn(facade, 'adicionarEspecialista');
      component.novaEspecialidade.set('Dermatologia');
      component.adicionarEspecialista();

      expect(spy).toHaveBeenCalledWith('Dermatologia');
      expect(component.novaEspecialidade()).toBe('');
      expect(component.estaAberto('novo-id')).toBe(true);
    });

    it('não faz nada se o campo estiver vazio', () => {
      const spy = jest.spyOn(facade, 'adicionarEspecialista');
      component.novaEspecialidade.set('   ');
      component.adicionarEspecialista();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('atualizarCampo delega ao facade com o campo certo', () => {
    const spy = jest.spyOn(facade, 'atualizarEspecialista');
    component.atualizarCampo(0, 'local', 'Clínica Central');
    expect(spy).toHaveBeenCalledWith(0, { local: 'Clínica Central' });
  });

  it('aoDigitarTelefone mascara o valor e atualiza via facade', () => {
    const spy = jest.spyOn(facade, 'atualizarEspecialista');
    const input = document.createElement('input');
    input.value = '11987654321';
    component.aoDigitarTelefone(0, { target: input } as unknown as Event);

    expect(input.value).toBe('(11) 98765-4321');
    expect(spy).toHaveBeenCalledWith(0, { telefone: '(11) 98765-4321' });
  });

  describe('removerEspecialista', () => {
    it('abre confirmação citando o nome do especialista', () => {
      component.removerEspecialista(0, especialista);
      expect(modal.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ nzTitle: 'Remover especialista', nzOkDanger: true })
      );
      expect(modal.confirm.mock.calls[0][0].nzContent).toContain('Pediatria');
    });

    it('chama facade.removerEspecialista ao confirmar', () => {
      const spy = jest.spyOn(facade, 'removerEspecialista');
      component.removerEspecialista(0, especialista);
      modal.confirm.mock.calls[0][0].nzOnOk();
      expect(spy).toHaveBeenCalledWith(0);
    });
  });

  describe('sub-tabelas de consultas e exames', () => {
    it('adicionar/remover/alterar consulta delegam ao facade com a sub-seção correta', () => {
      const addSpy = jest.spyOn(facade, 'adicionarLinhaEquipe');
      const remSpy = jest.spyOn(facade, 'removerLinhaEquipe');
      const altSpy = jest.spyOn(facade, 'atualizarLinhaEquipe');

      component.adicionarLinhaConsulta(0);
      component.removerLinhaConsulta(0, 1);
      component.alterarLinhaConsulta(0, { indice: 1, patch: { obs: 'x' } });

      expect(addSpy).toHaveBeenCalledWith(0, 'consultas', expect.objectContaining({ id: 'novo-id' }));
      expect(remSpy).toHaveBeenCalledWith(0, 'consultas', 1);
      expect(altSpy).toHaveBeenCalledWith(0, 'consultas', 1, { obs: 'x' });
    });

    it('adicionar/remover/alterar exame delegam ao facade com a sub-seção correta', () => {
      const addSpy = jest.spyOn(facade, 'adicionarLinhaEquipe');
      const remSpy = jest.spyOn(facade, 'removerLinhaEquipe');
      const altSpy = jest.spyOn(facade, 'atualizarLinhaEquipe');

      component.adicionarLinhaExame(0);
      component.removerLinhaExame(0, 2);
      component.alterarLinhaExame(0, { indice: 2, patch: { resultado: 'ok' } });

      expect(addSpy).toHaveBeenCalledWith(0, 'exames', expect.objectContaining({ id: 'novo-id' }));
      expect(remSpy).toHaveBeenCalledWith(0, 'exames', 2);
      expect(altSpy).toHaveBeenCalledWith(0, 'exames', 2, { resultado: 'ok' });
    });
  });
});
