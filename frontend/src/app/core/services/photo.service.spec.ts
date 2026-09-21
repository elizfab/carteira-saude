import { PhotoService } from './photo.service';

class ImagemFalsa {
  width = 800;
  height = 600;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  private valorSrc = '';

  set src(valor: string) {
    this.valorSrc = valor;
    queueMicrotask(() => this.onload?.());
  }

  get src(): string {
    return this.valorSrc;
  }
}

class ImagemQueFalha extends ImagemFalsa {
  override set src(valor: string) {
    queueMicrotask(() => this.onerror?.());
  }
}

describe('PhotoService', () => {
  let service: PhotoService;
  let drawImageSpy: jest.Mock;
  let toDataURLSpy: jest.Mock;
  let ImageOriginal: typeof Image;
  let createElementOriginal: typeof document.createElement;

  beforeEach(() => {
    service = new PhotoService();

    (URL as unknown as { createObjectURL: jest.Mock }).createObjectURL = jest.fn(() => 'blob:mock');
    (URL as unknown as { revokeObjectURL: jest.Mock }).revokeObjectURL = jest.fn();

    drawImageSpy = jest.fn();
    toDataURLSpy = jest.fn(() => 'data:image/jpeg;base64,MOCK');

    createElementOriginal = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      if (tag === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage: drawImageSpy }),
          toDataURL: toDataURLSpy,
        } as unknown as HTMLCanvasElement;
      }
      return createElementOriginal(tag);
    }) as typeof document.createElement);

    ImageOriginal = global.Image;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.Image = ImageOriginal;
  });

  it('redimensiona a imagem para 300x400 (cover-fit) e retorna um data URL JPEG', async () => {
    global.Image = ImagemFalsa as unknown as typeof Image;
    const arquivo = new File(['conteudo'], 'foto.png', { type: 'image/png' });

    const resultado = await service.processarArquivo(arquivo);

    expect(resultado).toBe('data:image/jpeg;base64,MOCK');
    expect(toDataURLSpy).toHaveBeenCalledWith('image/jpeg', 0.85);
    expect(drawImageSpy).toHaveBeenCalledTimes(1);
  });

  it('libera o object URL criado após processar a imagem', async () => {
    global.Image = ImagemFalsa as unknown as typeof Image;
    const arquivo = new File(['conteudo'], 'foto.png', { type: 'image/png' });

    await service.processarArquivo(arquivo);

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('rejeita quando o arquivo não pode ser lido como imagem', async () => {
    global.Image = ImagemQueFalha as unknown as typeof Image;
    const arquivo = new File(['nao e imagem'], 'foto.txt', { type: 'text/plain' });

    await expect(service.processarArquivo(arquivo)).rejects.toThrow(
      'Não foi possível ler essa imagem.'
    );
  });
});
