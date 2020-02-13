import HashIds from 'hashids/dist/hashids.js';

export class HashID {
  private readonly hashids = new HashIds('Autor.iR');

  encode(id) {
    return this.hashids.encode(id);
  }

  decode(hashedId) {
    return this.hashids.decode(hashedId);
  }
}
