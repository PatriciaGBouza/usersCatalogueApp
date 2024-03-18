import { Component, Input } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
import { ButtonsBoxComponent } from '../buttons-box/buttons-box.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ButtonsBoxComponent],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() myUser!: IUser

}
