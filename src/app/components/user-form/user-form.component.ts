import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  usersService = inject(UsersService);
  modelForm: FormGroup;
  isEmptyForm: boolean;

  /*
   Pattern to verify email addresses. Take a look at match / not match. It works very well. E-mail, email, mail, e-mail address, email address, mail address.
Matches	
john-smith@example.com | john.smith@example.com | john_smith@x-ample.com
Non-Matches	
.john-smith@example.com | @example.com | johnsmith@example.
      */
  emailPattern =
    '^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$';
  /* This regex matches fully qualified external urls (http, https). It uses the ms specific group-naming structure to present friendly named groups back to the user.
    Matches	
    http://www.myserver.mydomain.com/myfolder/mypage.aspx
    Non-Matches	
    www.myserver.mydomain.com/myfolder/mypage.aspx*/
  urlPattern =
    '(?<protocol>http(s)?)://(?<server>([A-Za-z0-9-]+.)*(?<basedomain>[A-Za-z0-9-]+.[A-Za-z0-9]+))+((/?)(?<path>(?<dir>[A-Za-z0-9._-]+)(/){0,1}[A-Za-z0-9.-/]*)){0,1}';

  constructor() {
    this.modelForm = new FormGroup(
      {
        first_name: new FormControl(null, [Validators.required]),
        last_name: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
        image: new FormControl(null, [
          Validators.required,
          Validators.pattern(this.urlPattern),
        ]),
      },
      []
    );
    this.isEmptyForm = true;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      console.log(params);
      let uuId = params._id;
      //console.log(" ngOnInit with _id"+ uuId);
      if (uuId !== undefined) {
        //case: edit user
        this.usersService.getByUuid(uuId).subscribe((data: IUser) => {
          console.log(
            'usersService.getByUuid returned ' + JSON.stringify(data)
          );
          let aUser = data;
          if (aUser._id){
            this.isEmptyForm = false;
            this.modelForm = new FormGroup(
              {
                _id: new FormControl(uuId, []),
                first_name: new FormControl(aUser.first_name, [
                  Validators.required,
                ]),
                last_name: new FormControl(aUser.last_name, [
                  Validators.required,
                ]),
                email: new FormControl(aUser.email, [
                  Validators.required,
                  Validators.pattern(this.emailPattern),
                ]),
                image: new FormControl(aUser.image, [
                  Validators.required,
                  Validators.pattern(this.urlPattern),
                ]),
              },
              []
            );
          }else{
            alert(
              'Error cargando datos del usuario. Por favor, contacte con el administrador.'
            );
          }
        });
      }
    });
  }

  validateField(
    formControlName: string,
    validator: string
  ): boolean | undefined {
    return (
      this.modelForm.get(formControlName)?.hasError(validator) &&
      this.modelForm.get(formControlName)?.touched
    );
  }

  saveFormData(): void {
    //console.log("saveFormData " + this.modelForm.get('_id')?.value + " "+ this.modelForm.get('first_name')?.value);
    //guardamos

    if (this.modelForm.value._id) {
      //update
      this.usersService
        .update(this.modelForm.value)
        .subscribe((data: IUser) => {
          console.log('usersService.update returned ' + JSON.stringify(data));
          let aUser = data;
          if (aUser.id) {
            alert(
              'Usuario ' +
                aUser.first_name +
                ' ' +
                aUser.last_name +
                ' actualizado correctamente'
            );
            this.modelForm.reset();
            this.router.navigate(['/']);
          } else {
            alert(
              'Error durante la actualización. Por favor, contacte con el administrador.'
            );
          }
        });
    } else {
      //insert
      this.usersService
        .insert(this.modelForm.value)
        .subscribe((data: IUser) => {
          console.log('usersService.insert returned ' + JSON.stringify(data));
          let aUser = data;
          if (aUser.id) {
            alert(
              'Usuario ' +
                aUser.first_name +
                ' ' +
                aUser.last_name +
                ' creado correctamente'
            );
            this.modelForm.reset();
            this.router.navigate(['/']);
          } else {
            alert(
              'Error durante la creación del usuario. Por favor, contacte con el administrador.'
            );
          }
        });
    }
  }
}
