import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-buttons-box',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './buttons-box.component.html',
  styleUrl: './buttons-box.component.css',
})
export class ButtonsBoxComponent {
  @Input() parent: string = '';
  @Input() idUser?: string = '';
  router = inject(Router);
  usersService = inject(UsersService);

  ngOnInit() {
    console.log('parent ' + parent);
  }

  deleteUser(uuid?: string) {
    if (uuid === undefined) {
      alert('Error, id null');
    } else {
      let aUser = 'Unknown';
      this.usersService.getByUuid(uuid).subscribe((data: IUser) => {
        console.log('usersService.getByUuid returned ' + JSON.stringify(data));
        if (!data._id) {
          alert(
            'Error durante el borrado del usuario. Por favor, contacte con el administrador.'
          );
        } else {
          aUser = data.first_name + ' ' + data.last_name;
          let confirmation = confirm(
            '¿Seguro que desea borrar al usuario ' + aUser + '?'
          );
          if (confirmation) {
            //remove
            let response = this.usersService.delete(uuid);
            this.usersService.delete(uuid).subscribe((data: IUser) => {
              console.log(
                'usersService.delete returned ' + JSON.stringify(data)
              );
              let aUser = data;
              if (aUser.id) {
                alert(
                  'Usuario ' +
                    aUser.first_name +
                    ' ' +
                    aUser.last_name +
                    ' borrado correctamente'
                );
                if (this.parent === 'view') {
                  this.router.navigate(['/']);
                }
              } else {
                alert(
                  'Error durante el borrado del usuario. Por favor, contacte con el administrador.'
                );
              }
            });
          }
        }
      });
    }
  }
}
