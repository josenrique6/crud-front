import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../../models/product';
import { firstValueFrom, Subscription } from 'rxjs';
import { InvoiceDetail } from '../../../models/InvoiceDetail';
import { Invoice } from '../../../models/Invoice';
import { ProductService } from '../../../services/product.service';
import { InvoiceService } from '../../../services/Invoice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit, OnDestroy  {


  form!: FormGroup;
  products: Product[] = [];
  filter = new FormControl<string>('', { nonNullable: true });
  modalRef?: BsModalRef;

  @ViewChild('productModal', { static: true }) productModalTpl!: TemplateRef<any>;

  private subs: Subscription[] = [];

  igvRate = 0.18; // IGV 18%

  get details(): FormArray<FormGroup> {
    return this.form.get('details') as FormArray<FormGroup>;
  }

  flagEdit = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private productSrv: ProductService,
    private invoiceSrv: InvoiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

ngOnInit(): void {
    this.buildForm();
    this.loadProducts();
    // Recalcular totales cuando cambian detalles
    this.subs.push(
      this.details.valueChanges.subscribe(() => this.recalcTotals())
    );

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.flagEdit = true;
        this.loadInvoice(Number(id));
      }
    });
  }

  private async loadInvoice(id: number): Promise<void> {
    var invoice = await firstValueFrom(this.invoiceSrv.getById(id));
    this.form.patchValue({
      series: invoice.series,
      number: invoice.number,
      date: invoice.date,
      customerRuc: invoice.customerRuc,
      customerName: invoice.customerName,
      currency: invoice.currency,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
    });
    this.details.clear();
    invoice.details.forEach(d => {
      const row = this.createDetailRow({
        productId: d.productId,
        productCode: d.productCode,
        productName: d.productName,
        quantity: d.quantity,
        price: d.price,
        amount: d.amount
      });
      this.details.push(row);
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  buildForm(): void {
    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10); // yyyy-MM-dd
    this.form = this.fb.group({
      series: this.fb.control('F001', { validators: [Validators.required] }),
      number: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)] }),
      date: this.fb.control(isoDate, { validators: [Validators.required] }),
      customerRuc: this.fb.control('', { validators: [Validators.required, Validators.minLength(8)] }),
      customerName: this.fb.control('', { validators: [Validators.required] }),
      currency: this.fb.control<'PEN' | 'USD'>('PEN', { validators: [Validators.required] }),
      subtotal: this.fb.control(0),
      tax: this.fb.control(0),
      total: this.fb.control(0),
      details: this.fb.array<FormGroup>([])
    });
  }

  private async loadProducts(): Promise<void> {
    this.products = await firstValueFrom(this.productSrv.getAll());
  }

  openProductModal(): void {
    this.filter.setValue('');
    this.modalRef = this.modalService.show(this.productModalTpl, { class: 'modal-lg' });
  }

  closeModal(): void {
    this.modalRef?.hide();
  }

  filteredProducts(): Product[] {
    const term = (this.filter.value || '').toLowerCase().trim();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.code.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term)
    );
  }

  selectProduct(p: Product): void {
    // Agregar fila de detalle con qty=1 y price=unitPrice
    const row = this.createDetailRow({
      productId: p.id,
      productCode: p.code,
      productName: p.name,
      quantity: 1,
      price: p.unitPrice,
      amount: this.round2(1 * p.unitPrice)
    });
    this.details.push(row);
    this.recalcTotals();
    this.closeModal();
  }

  createDetailRow(d: Partial<InvoiceDetail>): FormGroup {
    return this.fb.group({
      productId: this.fb.control(d.productId!, { validators: [Validators.required] }),
      productCode: this.fb.control(d.productCode || ''),
      productName: this.fb.control(d.productName || ''),
      quantity: this.fb.control(d.quantity ?? 1, { validators: [Validators.required, Validators.min(0.01)] }),
      price: this.fb.control(d.price ?? 0, { validators: [Validators.required, Validators.min(0)] }),
      amount: this.fb.control(this.round2(d.amount ?? 0), { validators: [Validators.required] })
    });
  }

  onQtyPriceChange(row: FormGroup): void {
    const qty = Number(row.get('quantity')?.value ?? 0);
    const price = Number(row.get('price')?.value ?? 0);
    row.get('amount')?.setValue(this.round2(qty * price), { emitEvent: false });
    this.recalcTotals();
  }

  removeDetail(i: number): void {
    this.details.removeAt(i);
    this.recalcTotals();
  }

  private recalcTotals(): void {
  const subtotal = (this.details.getRawValue() || [])
    .reduce((acc: number, d: any) => acc + Number(d['amount'] ?? 0), 0);
    const tax = this.round2(subtotal * this.igvRate);
    const total = this.round2(subtotal + tax);

    this.form.patchValue(
      { subtotal: this.round2(subtotal), tax, total },
      { emitEvent: false }
    );
  }

  private round2(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  submit(): void {
    // if (this.form.invalid || this.details.length === 0) {
    //   this.form.markAllAsTouched();
    //   return;
    // }

    const raw = this.form.getRawValue();
    var payload: Invoice = {
      series: raw.series,
      number: raw.number,
      date: raw.date,
      customerRuc: raw.customerRuc,
      customerName: raw.customerName,
      currency: raw.currency,
      subtotal: raw.subtotal,
      tax: raw.tax,
      total: raw.total,
      details: raw.details.map((d: any) => ({
        productId: d.productId,
        productCode: d.productCode,
        productName: d.productName,
        quantity: Number(d.quantity),
        price: Number(d.price),
        amount: Number(d.amount)
      }))
    };

    if(this.flagEdit){
      payload.id = Number(this.route.snapshot.paramMap.get('id') ?? 0);
      this.subs.push(
        this.invoiceSrv.update(payload).subscribe({
          next: (res) => {
            // Aquí puedes redirigir o limpiar el formulario
            alert(`Factura editada (ID: ${res ?? 's/n'})`);
            this.form.reset();
            this.details.clear();
            this.buildForm();
          },
          error: (err) => {
            console.error(err);
            alert('No se pudo editar la factura.');
          }
        })
      );
    }
    else {
      this.subs.push(
        this.invoiceSrv.create(payload).subscribe({
          next: (res) => {
            // Aquí puedes redirigir o limpiar el formulario
            alert(`Factura creada (ID: ${res ?? 's/n'})`);
            this.form.reset();
            this.details.clear();
            this.buildForm();
          },
          error: (err) => {
            console.error(err);
            alert('No se pudo registrar la factura.');
          }
        })
      );
    }

  }

  goBack(): void {
    this.router.navigate(['/facturas/busqueda']);
  }

  trackByIndex = (_: number, __: any) => _;

}
