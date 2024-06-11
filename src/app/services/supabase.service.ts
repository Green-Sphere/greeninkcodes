import { Injectable } from '@angular/core';
import { User, createClient } from '@supabase/supabase-js'
import { StripeService } from './stripe.service';

const supabase = createClient('https://mffktnyucherckkcoxxu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZmt0bnl1Y2hlcmNra2NveHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0MDA2NjEsImV4cCI6MjAyNDk3NjY2MX0.nwSbwVAHMG4vF5B-DxnLPgwhFX09pXMFZBqcR_TJWQA');

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  constructor(private stripe: StripeService) { }

  async login(email: string, password: string) {
    return new Promise<void>(async (resolve, reject) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) reject(error);
      if (data) resolve();
    });
  }
  async logout () {
    return new Promise<void>(async (resolve, reject) => {
      const { error } = await supabase.auth.signOut();
      if (error) reject(error);
      else resolve();
    });
  }

  async signup(name: string, email: string, password: string) {
    return new Promise<void>(async (resolve, reject) => {
      await this.stripe.createCustomer(name, email)
      .subscribe(async () => {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password
        });
        if (error) reject(error);
        if (data) resolve();
      });      
    });
  }

  async getLoggedInUser() {
    return new Promise<User | null>(async (resolve, reject) => {
      const { data } = await supabase.auth.getUser();
      resolve(data?.user ?? null);
    });
  }

  async uploadImage(file: File, userId: number, iconId: number) {
    return new Promise<void>(async (resolve, reject) => {
      const { data, error } = await supabase
      .storage
      .from('qr-icons')
      .upload(`${userId}/${iconId}`, file, {
        upsert: true
      });
      if (error) reject(error);
      if (data) resolve();
    });
  }

  async createReroute(name: string, url: string, color: string = '', icon: File | undefined = undefined) {
    return new Promise<string>(async (resolve, reject) => {
      const { data, error } = await supabase
      .from('reroutes')
      .insert({ name: name, route: url, color: color })
      .select();

      if (error) reject(error);
      if(data) {
        if(icon) {
          await this.uploadImage(icon, data[0].owner, data[0].id);
        }
        resolve(data[0].id);
      }
    });
  }

  async getUserURLs(){
    return new Promise(async (resolve, reject) => {
      const currentUser = await this.getLoggedInUser();

      if (!currentUser) {reject('Not logged in'); return;};

      const { data, error } = await supabase
        .from('reroutes')
        .select()
        .eq('owner', currentUser.id)
        .eq('deleted', false);

      if (error) reject(error);
      if (data) resolve(data);
    });
  }

  async getReroute(id: string) {
    return new Promise(async (resolve, reject) => {
      const currentUser = await this.getLoggedInUser();
      if (!currentUser) {reject('Not logged in'); return;};

      const { data, error } = await supabase
        .from('reroutes')
        .select()
        .eq('id', id);

      if (error) reject(error);
      if (data) {
        data[0].icon = await this.getRerouteIcon(id);
        console.log(data[0]);
        resolve(data);
      }
    });
  }

  async getRerouteIcon(id: string) {
    return new Promise(async (resolve, reject) => {
      const currentUser = await this.getLoggedInUser();
      if (!currentUser) {reject('Not logged in'); return;};
      const { data } = await supabase.storage.from('qr-icons')
          .createSignedUrl(`${currentUser.id}/${id}`, 60);
      if (data) {
        resolve(data.signedUrl);
      } else {
        resolve('');
      }
    });
  }

  async updateReroute(id: string, name: string, url: string) {
    return new Promise<void>(async (resolve, reject) => {
      console.log(id, name, url);
      const { error } = await supabase
        .from('reroutes')
        .update({ name: name, route: url })
        .eq('id', id);
        
      if (error) reject(error); 
      else resolve();
    });
  }

  async deleteReroute(id: string) {
    return new Promise<void>(async (resolve, reject) => {
      const { error } = await supabase
        .from('reroutes')
        .update({ deleted: true })
        .eq('id', id);
      if (error) reject(error); 
      else resolve();
    });
  }

  async getReferURL(id: string) {
    return new Promise<string>(async (resolve, reject) => {
      const { data, error } = await supabase
        .from('reroutes')
        .select('route')
        .eq('id', id);

      if (error) reject(error);
      if (data) resolve(data[0].route);
    });
  }
}
