import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  facturaForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.facturaForm = this.fb.group({
      serie: ['', Validators.required],
      numero: ['', Validators.required],
      fecha: ['', Validators.required],
      ruc: ['', [Validators.required, Validators.minLength(11)]],
      razonSocial: ['', Validators.required],
      moneda: ['PEN', Validators.required],
      items: this.fb.array([])
    });

  }

    get subtotal(): number {
    return this.items.controls.reduce((sum, ctrl) => {
      return sum + (ctrl.get('cantidad')?.value * ctrl.get('precio')?.value || 0);
    }, 0);
  }

  get igv(): number {
    return this.subtotal * 0.18;
  }

  get total(): number {
    return this.subtotal + this.igv;
  }

    get items(): FormArray {
    return this.facturaForm.get('items') as FormArray;
  }

}
