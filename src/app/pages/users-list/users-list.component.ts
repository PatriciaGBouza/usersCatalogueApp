import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { IWelcome } from '../../interfaces/iwelcome.interface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserCardComponent, NgFor],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  usersService= inject(UsersService);
  usersInfo: IWelcome|any;
  pages: any[]=[];
 
  ngOnInit() {
    this.usersService.getAllUsers().subscribe((data:IWelcome) => {
        console.log("usersService.getAllUsers returned "+ JSON.stringify(data));
        this.usersInfo=data;
        for (let i=1;i<=this.usersInfo.total_pages;i++){
          if(i==this.usersInfo.page){
              this.pages.push(this.usersInfo.results);
          }else{
              this.pages.push([]);
          }
        }
        //console.log(this.pages);
    });
  }

}
