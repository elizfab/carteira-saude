import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PhotoService } from '../../../core/services/photo.service';
import { PhotoUploadComponent } from './photo-upload.component';

describe('PhotoUploadComponent', () => {
  let fixture: ComponentFixture<PhotoUploadComponent>;
  let component: PhotoUploadComponent;
  let photoService: { processarArquivo: jest.Mock };
  let message: { error: jest.Mock };

  beforeEach(async () => {
    photoService = { processarArquivo: jest.fn() };
    message = { error: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PhotoUploadComponent],
      providers: [
        { provide: PhotoService, useValue: photoService },
        { provide: NzMessageService, useValue: message },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('mostra "Sem foto" quando não há fotoUrl', () => {
    expect(fixture.nativeElement.textContent).toContain('Sem foto');
    expect(fixture.nativeElement.querySelector('img')).toBeFalsy();
  });

  it('mostra a imagem e o botão remover quando há fotoUrl', () => {
    fixture.componentRef.setInput('fotoUrl', 'data:image/jpeg;base64,ABC');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img').src).toContain('data:image/jpeg');
    expect(fixture.nativeElement.textContent).toContain('Remover');
  });

  const criarEventoArquivo = (arquivo: File | undefined) => {
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: arquivo ? [arquivo] : [] });
    return { target: input } as unknown as Event;
  };

  it('emite fotoAlterada com o data URL processado', async () => {
    photoService.processarArquivo.mockResolvedValue('data:image/jpeg;base64,PROCESSADA');
    let emitido: string | undefined;
    component.fotoAlterada.subscribe((v) => (emitido = v));

    const arquivo = new File(['x'], 'foto.png', { type: 'image/png' });
    await component.aoEscolherArquivo(criarEventoArquivo(arquivo));

    expect(emitido).toBe('data:image/jpeg;base64,PROCESSADA');
  });

  it('mostra um erro quando o processamento da imagem falha', async () => {
    photoService.processarArquivo.mockRejectedValue(new Error('falhou'));
    const arquivo = new File(['x'], 'foto.png', { type: 'image/png' });

    await component.aoEscolherArquivo(criarEventoArquivo(arquivo));

    expect(message.error).toHaveBeenCalledWith('Não foi possível ler essa imagem.');
  });

  it('não faz nada quando nenhum arquivo é selecionado', async () => {
    await component.aoEscolherArquivo(criarEventoArquivo(undefined));
    expect(photoService.processarArquivo).not.toHaveBeenCalled();
  });

  it('remover emite fotoRemovida', () => {
    let removida = false;
    component.fotoRemovida.subscribe(() => (removida = true));
    component.remover();
    expect(removida).toBe(true);
  });
});
