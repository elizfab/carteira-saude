import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { AlergiasComponent } from './alergias.component';

describe('AlergiasComponent', () => {
  let fixture: ComponentFixture<AlergiasComponent>;
  let component: AlergiasComponent;
  let facade: PerfilFacadeService;

  const base = criarPerfilVazio('p1', 'Ana');
  const perfil = { ...base, alergias: { ...base.alergias, medicamentos: 'Dipirona - urticária' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlergiasComponent],
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

    fixture = TestBed.createComponent(AlergiasComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    fixture.detectChanges();
  });

  it('preenche o formulário com as alergias do perfil ativo', () => {
    expect(component.form.value.medicamentos).toBe('Dipirona - urticária');
    expect(component.form.value.alimentos).toBe('');
  });

  it('renderiza as 4 categorias fixas', () => {
    const rotulos = fixture.nativeElement.textContent;
    expect(rotulos).toContain('Medicamentos');
    expect(rotulos).toContain('Alimentos');
    expect(rotulos).toContain('Materiais');
    expect(rotulos).toContain('Outras alergias');
  });

  it('atualiza uma categoria sem afetar as outras', () => {
    const spy = jest.spyOn(facade, 'atualizarAlergias');
    component.form.patchValue({ alimentos: 'Amendoim' });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ alimentos: 'Amendoim', medicamentos: 'Dipirona - urticária' })
    );
  });
});
