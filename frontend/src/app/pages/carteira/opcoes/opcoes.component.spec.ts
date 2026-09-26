import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { criarPerfilVazio } from '../../../models';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { ImportExportService } from '../../../core/services/import-export.service';
import { OpcoesComponent } from './opcoes.component';

describe('OpcoesComponent', () => {
  let fixture: ComponentFixture<OpcoesComponent>;
  let component: OpcoesComponent;
  let facade: PerfilFacadeService;
  let importExportService: ImportExportService;
  let router: { navigate: jest.Mock };

  const base = criarPerfilVazio('p1', 'Ana');
  const perfil = {
    ...base,
    opcoes: { ...base.opcoes, incluir: { vacinas: false }, min: { ...base.opcoes.min, vacinas: 3 } },
  };

  beforeEach(async () => {
    router = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [OpcoesComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPerfilAtivo, value: perfil },
            { selector: selectTodosPerfis, value: [perfil] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: NzMessageService, useValue: { info: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpcoesComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(PerfilFacadeService);
    importExportService = TestBed.inject(ImportExportService);
    fixture.detectChanges();
  });

  it('incluida() é true por padrão e false quando explicitamente desmarcada', () => {
    expect(component.incluida('condicoes')).toBe(true);
    expect(component.incluida('vacinas')).toBe(false);
  });

  it('aoAlterarInclusao delega ao facade', () => {
    const spy = jest.spyOn(facade, 'atualizarInclusaoSecao');
    component.aoAlterarInclusao('exames', false);
    expect(spy).toHaveBeenCalledWith('exames', false);
  });

  it('paginasMinimas lê o valor configurado ou usa 1 como default', () => {
    expect(component.paginasMinimas('vacinas')).toBe(3);
    expect(component.paginasMinimas('exames')).toBe(1);
  });

  it('aoAlterarPaginasMinimas delega ao facade', () => {
    const spy = jest.spyOn(facade, 'atualizarPaginasMinimas');
    component.aoAlterarPaginasMinimas('controle', 5);
    expect(spy).toHaveBeenCalledWith('controle', 5);
  });

  it('baixarBackup gera o backup de todos os perfis', () => {
    const spy = jest.spyOn(importExportService, 'baixarJSON').mockImplementation(() => undefined);
    component.baixarBackup();
    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/^carteira-saude-backup-\d{4}-\d{2}-\d{2}\.json$/),
      importExportService.construirBackup([perfil])
    );
  });

  it('previsualizarEImprimir navega para /preview', () => {
    component.previsualizarEImprimir();
    expect(router.navigate).toHaveBeenCalledWith(['/preview']);
  });
});
