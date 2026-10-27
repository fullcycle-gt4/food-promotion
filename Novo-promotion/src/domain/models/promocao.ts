// ==========================================
//  HERANÇA: Modelagem dos Tipos de Promoção
// ==========================================
import { SeloFactory } from '../factories/SeloFactory';

abstract class Promocao {
  constructor(
    public id: string,
    public restauranteId: string,
    public valorBase: number,
    public tipoSelo: string // Usa o Flyweight indiretamente
  ) {}

  // Método abstrato que cada filha implementa à sua maneira
  abstract calcularDesconto(): number;

  public getVisual() {
    return SeloFactory.getSelo(this.tipoSelo);
  }
}

class PromocaoPorcentagem extends Promocao {
  constructor(id: string, restauranteId: string, valorBase: number, private porcentagem: number) {
    super(id, restauranteId, valorBase, 'FLASH');
  }

  calcularDesconto(): number {
    return this.valorBase * (this.porcentagem / 100);
  }
}