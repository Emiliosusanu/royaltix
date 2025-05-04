
    import { supabase } from '@/lib/supabaseClient';
    import { parseDateStringUTC, parseMonthYearString, parseYearString } from '@/lib/data/utils';
    import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

    // --- KDP Entry Mutations ---
    export const addEntry = async (newEntryData, userId) => {
      const { data, error } = await supabase
        .from('kdp_entries')
        .insert({ ...newEntryData, user_id: userId })
        .select('*, kdp_accounts(id, name, color)')
        .single();

      if (error) throw error;
      return {
          ...data,
          date: parseDateStringUTC(data.date),
          kdp_accounts: data.kdp_accounts || { id: null, name: 'Unknown', color: '#888888' }
      };
    };

    export const updateEntry = async (entryId, updatedData, userId) => {
      // Sanitize updatedData to only include allowed fields
      const allowedFields = ['income', 'ad_spend', 'income_currency', 'ad_spend_currency', 'date', 'account_id'];
      const dataToUpdate = Object.keys(updatedData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updatedData[key];
          return obj;
        }, {});

      // Ensure numeric fields are numbers
       if (dataToUpdate.hasOwnProperty('income')) {
           dataToUpdate.income = parseFloat(dataToUpdate.income);
           if (isNaN(dataToUpdate.income)) dataToUpdate.income = 0;
       }
       if (dataToUpdate.hasOwnProperty('ad_spend')) {
           dataToUpdate.ad_spend = parseFloat(dataToUpdate.ad_spend);
           if (isNaN(dataToUpdate.ad_spend)) dataToUpdate.ad_spend = 0;
       }

      if (Object.keys(dataToUpdate).length === 0) {
         console.warn("No valid fields provided for update.");
         return; // No valid fields to update
      }

      // Remove manual updated_at - rely on database trigger
      // dataToUpdate.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('kdp_entries')
        .update(dataToUpdate)
        .match({ id: entryId, user_id: userId })
        .select()
        .single();

      if (error) {
        console.error("Error updating entry:", error);
        // Check specifically for PGRST204, which means no row was found
        if (error.code === 'PGRST204') {
          throw new Error(`Entry with ID ${entryId} not found or doesn't belong to the current user.`);
        }
        throw error;
      }
      return data;
    };


    export const deleteEntry = async (idToDelete, userId) => {
      const { error } = await supabase
        .from('kdp_entries')
        .delete()
        .match({ id: idToDelete, user_id: userId });
      if (error) throw error;
    };

    // --- Account Mutations ---
    export const addAccount = async (newAccountData, userId) => {
      const { data, error } = await supabase
        .from('kdp_accounts')
        .insert({ ...newAccountData, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    };

    export const updateAccount = async (accountId, updatedData, userId) => {
      const { data, error } = await supabase
        .from('kdp_accounts')
        .update({ name: updatedData.name, color: updatedData.color /* Removed manual updated_at */ })
        .match({ id: accountId, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    };

    // --- Settings Mutations ---
    export const updateSettings = async (newSettingsData, userId) => {
      const updatePayload = {
          eur_to_usd_rate: newSettingsData.eur_to_usd_rate
          // Removed manual updated_at
      };

      const { data, error } = await supabase
        .from('settings')
        .update(updatePayload)
        .eq('user_id', userId)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') {
          console.error("Error updating settings:", error);
          throw error;
      }

      if (!data && (!error || error.code === 'PGRST116')) {
        console.log("No settings found to update, attempting insert.");
        const { data: insertedData, error: insertError } = await supabase
          .from('settings')
          .insert({ user_id: userId, eur_to_usd_rate: newSettingsData.eur_to_usd_rate })
          .select()
          .single();
        if (insertError) {
            console.error("Error inserting settings after failed update:", insertError);
            throw insertError;
        }
        console.log("Settings inserted:", insertedData);
        return insertedData;
      }
      console.log("Settings updated:", data);
      return data;
    };

    // --- Other Expense Mutations ---
    export const addOtherExpense = async (newExpenseData, userId) => {
      const { data, error } = await supabase
        .from('other_expenses')
        .insert({ ...newExpenseData, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return {
        ...data,
        date: parseDateStringUTC(data.date),
      };
    };

    export const deleteOtherExpense = async (idToDelete, userId) => {
      const { error } = await supabase
        .from('other_expenses')
        .delete()
        .match({ id: idToDelete, user_id: userId });
      if (error) throw error;
    };

    // --- Data Clearing ---
    const clearDataByFilter = async (tableName, filterType, value, userId, descriptionPrefix) => {
      let startDate, endDate;
      let description = "";

      if (filterType === 'month') {
        const date = parseMonthYearString(value);
        if (!date) throw new Error("Invalid month format for clearing.");
        startDate = format(startOfMonth(date), 'yyyy-MM-dd');
        endDate = format(endOfMonth(date), 'yyyy-MM-dd');
        description = `${descriptionPrefix} for ${format(date, 'MMMM yyyy')}`;
      } else if (filterType === 'year') {
        const date = parseYearString(value);
        if (!date) throw new Error("Invalid year format for clearing.");
        startDate = format(startOfYear(date), 'yyyy-MM-dd');
        endDate = format(endOfYear(date), 'yyyy-MM-dd');
        description = `${descriptionPrefix} for the year ${value}`;
      } else if (filterType === 'all') {
        description = `all ${descriptionPrefix}`;
      } else {
        throw new Error(`Invalid filter type "${filterType}" for clearing data.`);
      }

      let query = supabase.from(tableName).delete().eq('user_id', userId);

      if (filterType !== 'all') {
        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { error: deleteError } = await query;
      if (deleteError) throw deleteError;

      return description;
    };

    export const clearEntriesByFilter = (filterType, value, userId) => {
      return clearDataByFilter('kdp_entries', filterType, value, userId, 'KDP entries');
    };

    export const clearOtherExpensesByFilter = (filterType, value, userId) => {
      return clearDataByFilter('other_expenses', filterType, value, userId, 'other expenses');
    };
  