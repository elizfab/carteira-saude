import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { NotasComponent } from './notas.component';

describe('NotasComponent', () => {
  let fixture: ComponentFixture<NotasComponent>;
  let component: NotasComponent;
  let facade: PerfilFacadeService;

  const perfil = { ...criarPerfilVazio('p1', 'Ana'), notas: 'Acompanhar pressão semanalmente.' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasComponent],
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

    fixture = TestBed.createComponent(NotasComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('preenche o formulário com as notas do perfil ativo', () => {
    expect(component.form.value.notas).toBe('Acompanhar pressão semanalmente.');
  });

  it('atualiza as notas via facade quando o texto muda', () => {
    const spy = jest.spyOn(facade, 'atualizarNotas');
    component.form.patchValue({ notas: 'Novo texto' });
    expect(spy).toHaveBeenCalledWith('Novo texto');
  });
});
