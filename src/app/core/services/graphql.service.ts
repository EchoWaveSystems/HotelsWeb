import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hotel, CreateHotelInput, PagedHotelsResponse } from '../models/hotel.model';
import { APP_CONSTANTS } from '../config/app.constants';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private readonly apiUrl = APP_CONSTANTS.API_URL;

  constructor(private http: HttpClient) {}

  query<T>(query: string, variables: any = {}): Observable<T> {
    return this.http.post<any>(this.apiUrl, { query, variables }).pipe(
      map(response => {
        if (response.errors) {
          throw new Error(response.errors.map((e: any) => e.message).join(', '));
        }
        return response.data;
      })
    );
  }

  mutate<T>(mutation: string, variables: any = {}): Observable<T> {
    return this.query<T>(mutation, variables);
  }

  getHotels(take: number, skip: number, city?: string, searchQuery?: string, sortBy?: string, sortOrder?: string): Observable<PagedHotelsResponse> {
    let queryArgs = '$take: Int!, $skip: Int!';
    let hotelsArgs = 'take: $take, skip: $skip';

    if (city || searchQuery) {
      queryArgs += ', $where: HotelFilterInput';
      hotelsArgs += ', where: $where';
    }

    if (sortBy && sortOrder) {
      queryArgs += ', $order: [HotelSortInput!]';
      hotelsArgs += ', order: $order';
    }

    const query = `
      query GetHotels(${queryArgs}) {
        hotels(${hotelsArgs}) {
          items {
            uniqId
            name
            city
            address
            averageRating
            reviewCount
            photoCount
            amenities
            hotelStarRating
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          totalCount
        }
      }
    `;

    const variables: any = { take, skip };
    
    const conditions: any[] = [];
    if (city) {
      conditions.push({ city: { eq: city } });
    }
    if (searchQuery) {
      conditions.push({ name: { contains: searchQuery } });
    }

    if (conditions.length > 0) {
      variables.where = conditions.length === 1 ? conditions[0] : { and: conditions };
    }

    if (sortBy && sortOrder) {
      variables.order = [{ [sortBy]: sortOrder }];
    }

    return this.query<any>(query, variables).pipe(map(data => data?.hotels));
  }

  getHotel(uniqId: string): Observable<Hotel> {
    const query = `
      query GetHotel($uniqId: String!) {
        hotel(uniqId: $uniqId) {
          uniqId
          name
          crawlTimestamp
          pageUrl
          hotelId
          area
          city
          address
          lat
          long
          amenities
          hotelStarRating
          hotelType
          reviewCount
          averageRating
          photoCount
          cleanliness
          facilities
          location
          staff
          wifi
          comfort
          valueForMoney
        }
      }
    `;
    return this.query<any>(query, { uniqId }).pipe(map(data => data.hotel));
  }

  createHotel(input: CreateHotelInput): Observable<any> {
    const mutation = `
      mutation CreateHotel($input: CreateHotelInput!) {
        createHotel(input: $input) {
          uniqId
          status
          message
        }
      }
    `;
    return this.mutate<any>(mutation, { input }).pipe(map(data => data.createHotel));
  }
}
