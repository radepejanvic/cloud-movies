import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubscriptionsComponent } from './user-subscriptions.component';

describe('UserSubscriptionsComponent', () => {
  let component: UserSubscriptionsComponent;
  let fixture: ComponentFixture<UserSubscriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSubscriptionsComponent]
    });
    fixture = TestBed.createComponent(UserSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
