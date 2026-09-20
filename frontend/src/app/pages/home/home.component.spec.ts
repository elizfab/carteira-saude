import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { HomeComponent } from './home.component';
import { themeReducer } from '../../core/state/theme.reducer';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideStore({ theme: themeReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render PAGINA INICIAL', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('PAGINA INICIAL');
  });
});
