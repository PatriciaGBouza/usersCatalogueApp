import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { ButtonsBoxComponent } from '../../components/buttons-box/buttons-box.component';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterLink, ButtonsBoxComponent],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent {
  activatedRoute = inject(ActivatedRoute);
  usersService = inject(UsersService);
  aUser!: IUser;
  
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      console.log(params);
      let uuId = params._id;
      this.usersService.getByUuid(uuId).subscribe((data: IUser) => {
        console.log('usersService.getByUuid returned ' + JSON.stringify(data));
        this.aUser = data;
        if(!this.aUser._id){
          alert (
            'Error cargando datos del usuario. Por favor, contacte con el administrador.'
          );
        }
      });
    });
  }
}
