import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { FamiliarComponent } from './familiar.component';

describe('FamiliarComponent', () => {
  let fixture: ComponentFixture<FamiliarComponent>;
  let component: FamiliarComponent;
  let facade: PerfilFacadeService;

  const base = criarPerfilVazio('p1', 'Ana');
  const perfil = {
    ...base,
    familiar: { ...base.familiar, diabetes: { r: 'sim' as const, t: 'avó, 60 anos' } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliarComponent],
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

    fixture = TestBed.createComponent(FamiliarComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('preenche o formulário com o histórico familiar do perfil ativo', () => {
    expect(component.form.value.diabetes).toEqual({ r: 'sim', t: 'avó, 60 anos' });
    expect(component.form.value.hipertensao).toEqual({ r: '', t: '' });
  });

  it('atualiza somente a categoria alterada via facade', () => {
    const spy = jest.spyOn(facade, 'atualizarFamiliarItem');
    component.form.get('cancer')!.patchValue({ r: 'nao' });
    expect(spy).toHaveBeenCalledWith('cancer', expect.objectContaining({ r: 'nao' }));
  });

  it('limpar zera só o campo "r" da categoria, preservando o texto', () => {
    component.limpar('diabetes');
    expect(component.form.get('diabetes')!.value).toEqual({ r: '', t: 'avó, 60 anos' });
  });
});
