export interface payment {
 id:string ;
charge_id: string ;
validated_by:string ;
payment_date?: Date;
payment_method? : string ;
reference?: string;
notes?: string ;
}
export interface createpaymentinput {
charge_id: string ;
validated_by:string ;
payment_date?: Date;
payment_method? : string ;
reference?: string;
notes?: string ;
}