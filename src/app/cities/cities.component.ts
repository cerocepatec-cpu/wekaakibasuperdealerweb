import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CityService } from '../services/city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit {

cities: any[] = [];
  provinces: any[] = [];

  loading = false;
  submitting = false;

  // ⚠️ à remplacer dynamiquement (user connecté)
  enterprise_id = 1;

  form: any = {
    name: '',
    province_id: null
  };

  selectedCity: any = null; // pour update

  constructor(private cityService: CityService) {}

  ngOnInit() {
    this.loadCities();
    this.loadProvinces();
  }

  // 🔥 Charger les villes
  loadCities() {
    this.loading = true;

    this.cityService.getCities(this.enterprise_id).subscribe({
      next: (res: any) => {
        this.cities = res.data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur chargement villes', err);
        this.loading = false;
      }
    });
  }
addCity(){}
  // 🔥 Charger provinces (à créer côté backend)
  loadProvinces() {
    this.cityService.getProvinces().subscribe({
      next: (res: any) => {
        this.provinces = res.data;
      },
      error: (err) => {
        console.error('Erreur chargement provinces', err);
      }
    });
  }

  // 🔥 Ajouter ou modifier
  submit() {
    if (!this.form.name) {
      alert('Le nom de la ville est requis');
      return;
    }

    this.submitting = true;

    const payload = {
      ...this.form,
      enterprise_id: this.enterprise_id
    };

    if (this.selectedCity) {
      // ✏️ UPDATE
      this.cityService.updateCity(this.selectedCity.id, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadCities();
        },
        error: (err) => this.handleError(err)
      });
    } else {
      // ➕ CREATE
      this.cityService.createCity(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadCities();
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  // 🔥 Edit city
  editCity(city: any) {
    this.selectedCity = city;

    this.form = {
      name: city.name,
      province_id: city.province_id
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 🔥 Delete
  deleteCity(id: number) {
    if (!confirm('Supprimer cette ville ?')) return;

    this.cityService.deleteCity(id).subscribe({
      next: () => this.loadCities(),
      error: (err) => this.handleError(err)
    });
  }

  // 🔥 Reset form
  resetForm() {
    this.form = {
      name: '',
      province_id: null
    };

    this.selectedCity = null;
    this.submitting = false;
  }

  // 🔥 Gestion erreurs centralisée
  handleError(error: HttpErrorResponse) {
    console.error('Erreur:', error);

    this.submitting = false;

    if (error.error?.message) {
      alert(error.error.message);
    } else {
      alert('Une erreur est survenue');
    }
  }

}
