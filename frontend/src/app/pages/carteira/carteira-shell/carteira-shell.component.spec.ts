import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { criarPerfilVazio } from '../../../models';
import { selectIsDarkMode } from '../../../core/state';
import { selectAtivoId, selectPerfilAtivo, selectTodosPerfis } from '../../../core/state/perfil';
import { CarteiraShellComponent } from './carteira-shell.component';

describe('CarteiraShellComponent', () => {
  let fixture: ComponentFixture<CarteiraShellComponent>;
  const perfil = criarPerfilVazio('p1', 'Ana');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteiraShellComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectIsDarkMode, value: true },
            { selector: selectPerfilAtivo, value: perfil },
            { selector: selectTodosPerfis, value: [perfil] },
            { selector: selectAtivoId, value: 'p1' },
          ],
        }),
        { provide: NzMessageService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn() } },
        { provide: NzModalService, useValue: { confirm: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteiraShellComponent);
    fixture.detectChanges();
  });

  it('renderiza o topbar e o sidenav', () => {
    expect(fixture.nativeElement.querySelector('app-topbar')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-sidenav')).toBeTruthy();
  });

  it('renderiza um router-outlet dentro do main', () => {
    expect(fixture.nativeElement.querySelector('main router-outlet')).toBeTruthy();
  });
});
