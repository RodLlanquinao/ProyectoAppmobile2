import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  map!: any;
  destinationAddress: string = '';
  autocomplete: any;

  @ViewChild('destinationInput', { static: false, read: ElementRef }) destinationInput!: ElementRef;

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const mapContainer = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(mapContainer, {
      center: { lat: -33.4569, lng: -70.6483 },
      zoom: 12,
    });
  }

  initAutocomplete() {
    const inputElement = this.destinationInput.nativeElement.querySelector('input') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(inputElement);
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        this.destinationAddress = place.formatted_address;
        this.map.setCenter(place.geometry.location);

        // Agregar marcador en la ubicación seleccionada
        new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: 'Destino',
        });
      }
    });
  }

  setDestinationMarker() {
    if (this.destinationAddress.trim() !== '') {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: this.destinationAddress }, (results: any, status: any) => {
        if (status === 'OK') {
          const position = results[0].geometry.location;
          this.map.setCenter(position);

          new google.maps.Marker({
            position: position,
            map: this.map,
            title: 'Destino',
          });
        } else {
          alert('No se encontró la dirección: ' + status);
        }
      });
    } else {
      alert('Por favor, ingresa una dirección.');
    }
  }
}
