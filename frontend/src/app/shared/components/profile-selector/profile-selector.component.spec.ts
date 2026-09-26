import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzModalService } from 'ng-zorro-antd/modal';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { ProfileSelectorComponent } from './profile-selector.component';

describe('ProfileSelectorComponent', () => {
  let fixture: ComponentFixture<ProfileSelectorComponent>;
  let component: ProfileSelectorComponent;
  let facade: PerfilFacadeService;
  let modal: { confirm: jest.Mock };

  const perfil1 = criarPerfilVazio('p1', 'Ana');
  const perfil2 = criarPerfilVazio('p2', 'Bia');

  beforeEach(async () => {
    modal = { confirm: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProfileSelectorComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfil1 },
            { selector: selectTodosPerfis, value: [perfil1, perfil2] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: NzModalService, useValue: modal },
      ],
    })
      .overrideProvider(NzModalService, { useValue: modal })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileSelectorComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('lista todos os perfis com o rótulo correto', () => {
    expect(component.perfis().map((p) => component.rotuloPerfil(p))).toEqual(['Ana', 'Bia']);
  });

  it('usa "Perfil sem nome" quando o nome está vazio', () => {
    expect(component.rotuloPerfil(criarPerfilVazio('x'))).toBe('Perfil sem nome');
  });

  it('trocarPerfil delega ao facade', () => {
    const spy = jest.spyOn(facade, 'definirAtivo');
    component.trocarPerfil('p2');
    expect(spy).toHaveBeenCalledWith('p2');
  });

  describe('novo perfil', () => {
    it('abrirNovoPerfil limpa o nome e mostra o modal', () => {
      component.nomeNovoPerfil.set('lixo anterior');
      component.abrirNovoPerfil();
      expect(component.nomeNovoPerfil()).toBe('');
      expect(component.modalNovoVisivel()).toBe(true);
    });

    it('confirmarNovoPerfil cria o perfil e fecha o modal quando há nome', () => {
      const spy = jest.spyOn(facade, 'criarPerfil');
      component.modalNovoVisivel.set(true);
      component.nomeNovoPerfil.set('  Carlos  ');
      component.confirmarNovoPerfil();

      expect(spy).toHaveBeenCalledWith('Carlos');
      expect(component.modalNovoVisivel()).toBe(false);
    });

    it('confirmarNovoPerfil não faz nada se o nome estiver vazio', () => {
      const spy = jest.spyOn(facade, 'criarPerfil');
      component.modalNovoVisivel.set(true);
      component.nomeNovoPerfil.set('   ');
      component.confirmarNovoPerfil();

      expect(spy).not.toHaveBeenCalled();
      expect(component.modalNovoVisivel()).toBe(true);
    });
  });

  describe('excluirPerfilAtivo', () => {
    it('abre uma confirmação citando o nome do perfil ativo', () => {
      component.excluirPerfilAtivo();
      expect(modal.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ nzTitle: 'Excluir perfil', nzOkDanger: true })
      );
      expect(modal.confirm.mock.calls[0][0].nzContent).toContain('Ana');
    });

    it('chama facade.excluirPerfil quando o usuário confirma', () => {
      const spy = jest.spyOn(facade, 'excluirPerfil');
      component.excluirPerfilAtivo();
      const { nzOnOk } = modal.confirm.mock.calls[0][0];
      nzOnOk();
      expect(spy).toHaveBeenCalledWith('p1');
    });
  });
});
