export class HitBase {
  _elastic_id: string;
  _index: string;
  _type: string;
  _score: number;
}

export class AuthorHit extends HitBase {
  firstName: string;
  lastName: string;
  addressId: string;
  id: string;
}
