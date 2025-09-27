/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PruebaService } from './prueba.service';

describe('Service: Prueba', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PruebaService]
    });
  });

  it('should ...', inject([PruebaService], (service: PruebaService) => {
    expect(service).toBeTruthy();
  }));
});
