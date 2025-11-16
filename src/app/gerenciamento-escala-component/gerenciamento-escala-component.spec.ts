import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoEscalaComponent } from './gerenciamento-escala-component';

describe('GerenciamentoEscalaComponent', () => {
  let component: GerenciamentoEscalaComponent;
  let fixture: ComponentFixture<GerenciamentoEscalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoEscalaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoEscalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
