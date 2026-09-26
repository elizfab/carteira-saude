import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { DadosPessoaisComponent } from './dados-pessoais.component';

describe('DadosPessoaisComponent', () => {
  let fixture: ComponentFixture<DadosPessoaisComponent>;
  let component: DadosPessoaisComponent;
  let facade: PerfilFacadeService;

  const base = criarPerfilVazio('p1', 'Ana');
  const perfil = { ...base, dados: { ...base.dados, cpf: '123.456.789-01' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosPessoaisComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfil },
            { selector: selectTodosPerfis, value: [perfil] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DadosPessoaisComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('preenche o formulário com os dados do perfil ativo', () => {
    expect(component.form.value.nome).toBe('Ana');
    expect(component.form.value.cpf).toBe('123.456.789-01');
  });

  it('atualiza o perfil ativo via facade quando o formulário muda', () => {
    const spy = jest.spyOn(facade, 'atualizarDados');
    component.form.patchValue({ nome: 'Ana Paula' });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Ana Paula' }));
  });

  it('limparTipoSanguineo zera abo e rh sem afetar outros campos', () => {
    component.form.patchValue({ abo: 'A', rh: '+' });
    component.limparTipoSanguineo();
    expect(component.form.value.abo).toBe('');
    expect(component.form.value.rh).toBe('');
    expect(component.form.value.nome).toBe('Ana');
  });

  it('aoAlterarFoto atualiza dados.foto via facade', () => {
    const spy = jest.spyOn(facade, 'atualizarDados');
    component.aoAlterarFoto('data:image/jpeg;base64,ABC');
    expect(spy).toHaveBeenCalledWith({ foto: 'data:image/jpeg;base64,ABC' });
  });

  it('removerFoto limpa dados.foto via facade', () => {
    const spy = jest.spyOn(facade, 'atualizarDados');
    component.removerFoto();
    expect(spy).toHaveBeenCalledWith({ foto: '' });
  });

  it('fotoUrl reflete a foto do perfil ativo', () => {
    expect(component.fotoUrl).toBe('');
  });
});
