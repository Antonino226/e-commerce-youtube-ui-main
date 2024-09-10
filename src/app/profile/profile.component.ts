import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string | null = null;
  user: any; // Contiene i dati dell'utente

  constructor(private route: ActivatedRoute, private userService: UserAuthService) {}

  ngOnInit(): void {
    // Ottenere l'userid dai parametri di rotta (anche se non è utilizzato in questo caso)
    this.userName = this.route.snapshot.paramMap.get('userName');

    // Recupera l'utente dal servizio
    this.user = this.userService.getUser();

    // Opzionale: Puoi loggare i dati per assicurarti che siano recuperati correttamente
    console.log(this.user);
  }
}
