import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColunaTabela } from '../../../models';
import { EditableTableComponent } from './editable-table.component';

interface LinhaTeste {
  id: string;
  nome: string;
  obs: string;
}

const COLUNAS: ColunaTabela<LinhaTeste>[] = [
  { chave: 'nome', rotulo: 'Nome' },
  { chave: 'obs', rotulo: 'Observações', tipo: 'area' },
];

describe('EditableTableComponent', () => {
  let fixture: ComponentFixture<EditableTableComponent<LinhaTeste>>;
  let component: EditableTableComponent<LinhaTeste>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditableTableComponent<LinhaTeste>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('colunas', COLUNAS);
    fixture.componentRef.setInput('linhas', []);
    fixture.componentRef.setInput('rotuloAdicionar', 'Adicionar item');
  });

  it('mostra a linha de estado vazio quando não há registros', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nenhum registro ainda.');
  });

  it('renderiza uma linha por item, com um input por coluna', () => {
    fixture.componentRef.setInput('linhas', [
      { id: '1', nome: 'BCG', obs: '' },
      { id: '2', nome: 'Hepatite B', obs: 'reforço pendente' },
    ]);
    fixture.detectChanges();

    const linhas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(linhas.length).toBe(2);
    expect(linhas[0].querySelector('input').value).toBe('BCG');
    expect(linhas[1].querySelector('textarea').value).toBe('reforço pendente');
  });

  it('emite "adicionar" ao clicar no botão de adicionar, com o rótulo customizado', () => {
    fixture.detectChanges();
    const emitidos: void[] = [];
    component.adicionar.subscribe(() => emitidos.push(undefined));

    const botao: HTMLButtonElement = fixture.nativeElement.querySelector('button:not(.col-acao button)');
    expect(botao.textContent).toContain('Adicionar item');
    botao.click();

    expect(emitidos.length).toBe(1);
  });

  it('emite "remover" com o índice da linha clicada', () => {
    fixture.componentRef.setInput('linhas', [
      { id: '1', nome: 'A', obs: '' },
      { id: '2', nome: 'B', obs: '' },
    ]);
    fixture.detectChanges();

    let indiceRemovido: number | undefined;
    component.remover.subscribe((i) => (indiceRemovido = i));

    const botoesRemover = fixture.nativeElement.querySelectorAll('tbody tr .col-acao button');
    botoesRemover[1].click();

    expect(indiceRemovido).toBe(1);
  });

  it('emite "alterar" com o índice e o patch correto ao editar um campo', () => {
    fixture.componentRef.setInput('linhas', [{ id: '1', nome: 'BCG', obs: '' }]);
    fixture.detectChanges();

    let alteracao: { indice: number; patch: Partial<LinhaTeste> } | undefined;
    component.alterar.subscribe((a) => (alteracao = a));

    const input: HTMLInputElement = fixture.nativeElement.querySelector('tbody tr input');
    input.value = 'BCG (1ª dose)';
    input.dispatchEvent(new Event('input'));

    expect(alteracao).toEqual({ indice: 0, patch: { nome: 'BCG (1ª dose)' } });
  });
});
