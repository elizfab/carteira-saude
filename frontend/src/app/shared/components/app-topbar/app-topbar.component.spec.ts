import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { criarPerfilVazio } from '../../../models';
import { selectIsDarkMode } from '../../../core/state';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { ImportExportService } from '../../../core/services/import-export.service';
import { PerfilFacadeService } from '../../../core/facades/perfil-facade.service';
import { AppTopbarComponent } from './app-topbar.component';

describe('AppTopbarComponent', () => {
  let fixture: ComponentFixture<AppTopbarComponent>;
  let component: AppTopbarComponent;
  let router: Router;
  let facade: PerfilFacadeService;
  let importExportService: ImportExportService;
  let message: { success: jest.Mock; error: jest.Mock; info: jest.Mock };

  const perfilAtivo = criarPerfilVazio('p1', 'Ana');

  beforeEach(async () => {
    message = { success: jest.fn(), error: jest.fn(), info: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AppTopbarComponent],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        provideMockStore({
          selectors: [
            { selector: selectIsDarkMode, value: true },
            { selector: selectPerfilAtivo, value: perfilAtivo },
            { selector: selectTodosPerfis, value: [perfilAtivo] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: NzMessageService, useValue: message },
        { provide: NzModalService, useValue: { confirm: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTopbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    facade = TestBed.inject(PerfilFacadeService);
    importExportService = TestBed.inject(ImportExportService);
    fixture.detectChanges();
  });

  it('mostra "Modo claro" quando o tema atual é escuro', () => {
    expect(component.isDarkMode()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Modo claro');
  });

  it('previsualizar navega para /preview', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.previsualizar();
    expect(spy).toHaveBeenCalledWith(['/preview']);
  });

  it('imprimir navega para /preview com o parâmetro de auto-impressão', () => {
    const spy = jest.spyOn(router, 'navigate');
    component.imprimir();
    expect(spy).toHaveBeenCalledWith(['/preview'], { queryParams: { auto: 'print' } });
  });

  it('exportar baixa um backup do perfil ativo', () => {
    const spy = jest.spyOn(importExportService, 'baixarJSON').mockImplementation(() => undefined);
    component.exportar();
    expect(spy).toHaveBeenCalledWith(
      'carteira-saude-ana.json',
      importExportService.construirBackup([perfilAtivo])
    );
    expect(message.info).toHaveBeenCalled();
  });

  describe('importar', () => {
    const criarEventoArquivo = (conteudo: string) => {
      const arquivo = new File([conteudo], 'perfil.json', { type: 'application/json' });
      (arquivo as unknown as { text: () => Promise<string> }).text = jest.fn().mockResolvedValue(conteudo);
      const input = document.createElement('input');
      Object.defineProperty(input, 'files', { value: [arquivo] });
      return { target: input } as unknown as Event;
    };

    it('importa um arquivo válido, navega para dados e avisa sucesso', async () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const importarPerfisSpy = jest.spyOn(facade, 'importarPerfis');
      const json = JSON.stringify({ perfis: [criarPerfilVazio('p2', 'Bia')] });

      await component.importar(criarEventoArquivo(json));

      expect(importarPerfisSpy).toHaveBeenCalledWith([expect.objectContaining({ id: 'p2' })], 'p2');
      expect(navigateSpy).toHaveBeenCalledWith(['/carteira', 'dados']);
      expect(message.success).toHaveBeenCalled();
    });

    it('mostra erro para um arquivo que não é JSON válido', async () => {
      await component.importar(criarEventoArquivo('não é json'));
      expect(message.error).toHaveBeenCalled();
    });

    it('mostra erro para um JSON sem formato reconhecível', async () => {
      await component.importar(criarEventoArquivo(JSON.stringify({ qualquerCoisa: 1 })));
      expect(message.error).toHaveBeenCalled();
    });
  });
});
