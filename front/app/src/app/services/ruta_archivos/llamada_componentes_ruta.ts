import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlamadaComponentesRutaArchivos {
  // BehaviorSubject to store the current active popover ID and data
  private activePopover = new BehaviorSubject<{ id: number | null, data?: any }>({ id: null });

  // Observable for components to listen to the active popover
  getActivePopover(): Observable<{ id: number | null, data?: any }> {
    return this.activePopover.asObservable();
  }

  // Set the active popover with ID and data
  setActivePopover(id: number, data?: any): void {
    this.activePopover.next({ id, data });
  }

  // Clear the active popover
  clearActivePopover(): void {
    this.activePopover.next({ id: null, data: null });
  }
}